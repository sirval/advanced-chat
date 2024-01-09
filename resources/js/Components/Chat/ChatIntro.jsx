import React from 'react';

const ChatIntro = ({receiver}) => {
  return (
    <section className="bg-gray-100 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Obidient</h2>
          <h5 className="text-2xl font-extrabold text-gray-500">Chat, Connect, and More</h5>
          <p className="mt-4 text-xl text-gray-600">
            Explore the versatile features of Obidient for all your communication needs with {receiver?.name}.
          </p>
        </div>
        <div className="mt-10">
          <div className="flex flex-wrap -m-4">
            {/* Card 1 */}
            <div className="p-4 md:w-1/2 lg:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900">Chat with Friends</h3>
                <p className="mt-4 text-gray-600">
                  Enjoy end-to-end encrypted messaging with your friends.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="p-4 md:w-1/2 lg:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900">Video Calls</h3>
                <p className="mt-4 text-gray-600">
                  Have face-to-face conversations through high-quality video calls.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="p-4 md:w-1/2 lg:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900">Connect with Groups</h3>
                <p className="mt-4 text-gray-600">
                  Stay connected with groups of friends and colleagues.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="p-4 md:w-1/2 lg:w-1/4">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900">Voice Notes</h3>
                <p className="mt-4 text-gray-600">
                  Send voice notes to express yourself in a more personal way.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatIntro;
