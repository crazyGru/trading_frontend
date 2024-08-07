import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MessageContainer from './MessageContainer';
import { useToast } from '@/components/ui/use-toast';
import { io } from 'socket.io-client';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';

const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL

const socket = io(BASE_URL, { withCredentials: true });

const ImageChannel = ({ channel, user }) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const scrollAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/messages/${channel.id}`, { withCredentials: true });
        setMessages(response.data.conversation);
      } catch (error) {
        toast({
          title: 'Error fetching messages',
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      }
    };

    fetchMessages();

    socket.emit('joinChannel', channel.id);

    socket.on('newMessage', (message) => {
      if (message.conversationId === channel.id) {
        setMessages((prevMessages) => {
          // Prevent duplicate messages
          const messageExists = prevMessages.some(prevMessage => prevMessage.id === message.id);
          if (messageExists) return prevMessages;

          return [...prevMessages, message];
        });
        scrollToBottom(); // Scroll to bottom when a new message arrives
      }
    });

    socket.on('newImage', (image) => {
      if (image.conversationId === channel.id) {
        setMessages((prevMessages) => {
          // Prevent duplicate images
          const imageExists = prevMessages.some(prevMessage => prevMessage.id === image.id);
          if (imageExists) return prevMessages;

          return [...prevMessages, { body: 'Image uploaded', ...image }];
        });
        toast({
          title: 'New Image',
          description: 'A new image has been uploaded to the channel.',
        });
        scrollToBottom(); // Scroll to bottom when a new image arrives
      }
    });

    return () => {
      socket.emit('leaveChannel', channel.id);
      socket.off('newMessage');
      socket.off('newImage');
    };
  }, [channel.id, toast]);

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom when messages change
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === '' && !image) return;

    if (image) {
      const formData = new FormData();
      formData.append('image', image);

      try {
        const response = await axios.post(`${BASE_URL}/api/images/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        });
        setImage(null);
        setPreviewImage(null);
        toast({ title: 'Image uploaded', description: 'Your image has been uploaded successfully and a new channel has been created.' });
        scrollToBottom(); // Scroll to bottom when a new image is uploaded
      } catch (error) {
        toast({
          title: 'Error uploading image',
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      }
    } else {
      try {
        await axios.post(`${BASE_URL}/api/messages/send/${channel.id}`, { message: newMessage }, { withCredentials: true });
        setNewMessage('');
      } catch (error) {
        toast({
          title: 'Error sending message',
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleImageChange = (e) => {
    if (user.credits === 0) {
      toast({
        title: 'Insufficient Credits',
        description: 'You need more credits to upload images.',
        variant: 'destructive',
      });
      return;
    }

    const file = e.target.files[0];
    if (file) {
      setImage(file);
      try {
        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
      } catch (error) {
        toast({
          title: 'Error loading image',
          description: 'An error occurred while trying to preview the image.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-discord-secondary shadow-lg rounded-lg overflow-hidden">
      {channel.image && channel.image.url ? (
        <img 
          src={`${BASE_URL}${channel.image.url}`} 
          alt="Channel Image" 
          className="w-full h-64 object-top object-cover rounded-t-lg" 
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
          No Image
        </div>
      )}
      <ScrollArea ref={scrollAreaRef} className="flex-grow overflow-y-auto p-4">
        <MessageContainer messages={messages} />
      </ScrollArea>
      {previewImage && (
        <div className="relative p-4">
          <Image src={previewImage} alt="Preview" width={300} height={300} className="object-cover rounded mb-4" />
          <div className="absolute top-0 right-0 flex space-x-1">
            <TrashIcon 
              size={10}
              className="w-6 h-6 text-red-600 bg-white rounded-full p-1 cursor-pointer"
              onClick={() => {
                setImage(null);
                setPreviewImage(null);
              }}
            />
          </div>
        </div>
      )}
      <div className="flex items-center p-4 border-t bg-discord-inputBg relative">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 bg-discord-inputBg border-discord-inputBorder text-discord-text rounded-l-md p-2 mr-2 shadow-sm focus:ring focus:border-blue-300"
          placeholder="Type your message..."
        />
        <label htmlFor="file_upload" className={`cursor-pointer mr-2 ${user.credits === 0 ? 'tooltip' : ''}`} data-tooltip="You need more credits to upload images.">
          <ImageIcon className="w-6 h-6 text-discord-primary hover:text-discord-secondary" />
          <input
            type="file"
            id="file_upload"
            onChange={handleImageChange}
            className="hidden"
            disabled={user.credits === 0}
          />
        </label>
        <button 
          onClick={sendMessage} 
          className="bg-discord-primary text-white p-2 rounded-md shadow-sm hover:bg-discord-secondary transition-colors"
          disabled={!newMessage.trim() && !image}
        >
          {image ? 'Upload' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default ImageChannel;
