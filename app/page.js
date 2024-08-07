'use client'; 

import { useEffect, useState } from 'react';
import axios from 'axios';
import ImageChannel from '@/components/ImageChannel';
import CreditManagement from '@/components/CreditManagement';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LogOutIcon, PlusCircleIcon, XCircleIcon, MenuIcon } from 'lucide-react'; // Added icons
import Image from 'next/image';
import { useRouter } from 'next/navigation';
const BASE_URL =process.env.BASE_URL ||'http://localhost:5001'; // Update this to your backend's base URL
 
export default function Home() {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Added state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/auth/me`, { withCredentials: true });
        setUser(response.data.user);
      } catch (error) {
        router.push('/auth/login');
      }
    };

    fetchUser();
  }, [toast]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/images/channels`, { withCredentials: true });
        setChannels(response.data.channels);
        if (response.data.channels.length > 0) {
          setSelectedChannel(response.data.channels[0]);
        }
      } catch (error) {
        router.push('/auth/login');
        toast({
          title: 'Error fetching channels',
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      }
    };

    fetchChannels();
  }, [toast]);

  const handleImageUpload = (newChannel) => {
    setChannels([...channels, newChannel]);
    setSelectedChannel(newChannel);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      router.push('/auth/login');
      setUser(null);
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error logging out',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
    }
  };

  const handleImageChange = async (e) => {
    if (user.credits === 0) {
      toast({
        title: 'Insufficient Credits',
        description: 'You need more credits to upload images.',
        variant: 'destructive',
      });
      return;
    }

    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${BASE_URL}/api/images/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      toast({ title: 'Image uploaded', description: 'Your image has been uploaded successfully and a new channel has been created.' });

      const newChannel = response.data.newConversation;
      handleImageUpload(newChannel);
    } catch (error) {
      toast({
        title: 'Error uploading image',
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-discord-secondary p-4">
        <div className="bg-discord-primary p-6 rounded-lg shadow-lg w-full max-w-md text-center text-discord-text">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Chat Application</h1>
          <Link href="/auth/login" className="text-blue-500 block mb-2">Login</Link>
          <Link href="/auth/signup" className="text-blue-500">Signup</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center lg:items-start justify-center max-h-screen bg-discord-secondary p-4 w-full h-screen">
      <div className={`bg-discord-primary p-6 rounded-lg shadow-lg lg:w-1/5 w-44 h-full flex flex-col justify-between items-center space-y-4 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute top-4 right-4 lg:hidden">
          {isSidebarOpen ? <XCircleIcon size={24} /> : <MenuIcon size={24} />}
        </button>
        <ScrollArea className="w-full h-screen flex-grow overflow-y-auto">
          <h2 className="font-bold text-lg mb-2 text-discord-text">Channels</h2>
          {channels.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {channels.map(channel => (
                <div
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`cursor-pointer flex flex-col items-center p-4 rounded-lg shadow-md text-discord-text ${
                    selectedChannel?.id === channel.id ? 'bg-discord-highlight' : 'hover:bg-discord-inputBg'
                  }`}
                >
                  {channel.image && channel.image.url ? (
                    <img className="rounded-full md:w-[76px] md:h-[76px] lg:w-[96px] lg:h-[96px] w-[48px] h-[48px] object-cover mb-2" src={`${BASE_URL}${channel.image.url}`} alt="Channel Image" />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-full mb-2">
                      No Image
                    </div>
                  )}
                  <span>Channel</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-discord-text mb-4">No channels available</p>
              <button
                onClick={() => document.getElementById('file_upload').click()}
                className="bg-discord-primary text-white p-4 rounded-md shadow-sm hover:bg-discord-secondary transition-colors flex items-center"
              >
                <PlusCircleIcon className="w-6 h-6 mr-2" />
                Upload Image
              </button>
              <input
                type="file"
                id="file_upload"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewImage && (
                <div className="relative mt-2">
                  <Image src={previewImage} alt="Preview" width={60} height={60} className="object-cover rounded" />
                  <div className="absolute top-0 right-0 flex space-x-1">
                    <TrashIcon
                      className="w-4 h-4 text-red-600 bg-white rounded-full p-1 cursor-pointer"
                      onClick={() => {
                        setImage(null);
                        setPreviewImage(null);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
        <div className="flex w-full justify-left space-x-4 mt-4">
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
            <LogOutIcon size={24} />
          </button>
          <CreditManagement user={user} setUser={setUser} />
        </div>
      </div>
      <div className="w-full md:order-2 order-1 lg:w-3/4 p-4 bg-discord-secondary shadow-lg rounded-lg overflow-y-auto h-full">
        {selectedChannel ? (
          <ImageChannel channel={selectedChannel} user={user} />
        ) : (
          <div className="flex items-center justify-center h-full text-discord-text">
            Select a channel to view messages.
          </div>
        )}
      </div>
    </div>
  );
}
