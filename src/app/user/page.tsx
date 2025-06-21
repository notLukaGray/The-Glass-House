import { PortableText } from '@portabletext/react';
import Image from 'next/image';
import { getImageAssetServer } from '@/_lib/handlers/serverHandlers';
import { getUserDataServer } from '@/_lib/data/user';

export default async function UserPage() {
  const user = await getUserDataServer();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-600">Failed to load user data.</h1>
      </main>
    );
  }

  const avatar = user.avatar?._ref ? await getImageAssetServer({ id: user.avatar._ref }) : null;

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <div className="text-center mb-8">
          {avatar && (
            <Image
              src={avatar.url}
              alt={avatar.title?.en || 'User Avatar'}
              width={150}
              height={150}
              className="rounded-full mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">
            {typeof user.name === 'string' ? user.name : user.name?.en || 'User'}
          </h1>
          {user.jobTitle && (
            <p className="text-xl text-gray-600">
              {typeof user.jobTitle === 'string' ? user.jobTitle : user.jobTitle?.en}
            </p>
          )}
        </div>

        {user.bio && (
          <div className="prose max-w-none mb-8">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PortableText value={user.bio as any} />
          </div>
        )}

        {user.social && user.social.length > 0 && (
          <div className="flex justify-center space-x-4">
            {user.social.map((social) => (
              <a
                key={social._id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {social.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  );
} 