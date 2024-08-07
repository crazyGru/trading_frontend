import Image from "next/image";
import { format } from 'date-fns';

const BASE_URL =process.env.BASE_URL|| 'http://localhost:5001';  // Update this to your backend's base URL

const MessageContainer = ({ messages }) => {
  return (
    <div className="p-4 overflow-y-auto space-y-4">
      {messages.map((message, index) => (
        <div key={index} className="mb-2 p-4 border-b border-gray-700 bg-discord-secondary rounded-lg text-discord-text shadow-md">
          <div className="flex items-start mb-2">
            {/* <div className="w-12 h-12 mr-4">
              <img src={`${BASE_URL}/path-to-user-avatar/${message.senderId}`} alt="Avatar" className="rounded-full w-full h-full object-cover" />
            </div> */}
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <span className="font-bold text-white mr-2">{message.senderName}</span>
                <span className="text-xs text-gray-400">{format(new Date(message.createdAt), 'PPpp')}</span>
              </div>
              <div>
                {message.body ? (
                  <p className="text-gray-300">{message.body}</p>
                ) : (
                  <div className="mt-2">
                    <Image fill src={`${BASE_URL}${message.url}`} alt="Uploaded" className="rounded-md" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageContainer;
