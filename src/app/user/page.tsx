import { PortableText } from '@portabletext/react';
import { getImageAsset } from '@/_lib/handlers/imageHandler';
import { client } from '@/_lib/handlers/sanity';

export default async function UserPage() {
  // Batch fetch user, social links, and SVG icons in one GROQ query
  const user: any = await client.fetch(`*[_type == "user"][0]{
    _id,
    name,
    jobTitle,
    avatar,
    bio,
    social[]->{
      _id,
      name,
      url,
      icon->{
        _id,
        svgData
      }
    }
  }`);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl text-red-600">No user found.</h1>
      </main>
    );
  }

  const avatar = user.avatar?._ref ? await getImageAsset({ id: user.avatar._ref }) : null;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black p-8">
      <div className="flex flex-col items-center max-w-xl w-full gap-6">
        {avatar && (
          <img
            src={avatar.url}
            alt={avatar.description?.en || avatar.title?.en || 'User Avatar'}
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
          />
        )}
        <h1 className="text-3xl font-bold text-center">{user.name?.en || user.name}</h1>
        <h2 className="text-lg text-gray-600 text-center">{user.jobTitle?.en || user.jobTitle}</h2>
        <div className="space-y-4 mt-4">
          {user.bio && (
            <PortableText
              value={user.bio}
              components={{
                block: {
                  normal: ({ children }) => <p className="text-base text-gray-800 text-center">{children}</p>,
                },
              }}
            />
          )}
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          {user.social && user.social.length > 0 ? (
            user.social.map((link: any) => (
              <a
                key={link._id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:underline text-base font-medium"
              >
                {link.icon?.svgData && (
                  <span
                    className="w-6 h-6 inline-block align-middle"
                    dangerouslySetInnerHTML={{ __html: link.icon.svgData }}
                  />
                )}
                {link.name}
              </a>
            ))
          ) : (
            <span className="text-gray-400">[Social links coming soon]</span>
          )}
        </div>
      </div>
    </main>
  );
} 