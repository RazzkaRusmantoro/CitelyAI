import Link from 'next/link'

export default async function Confirmation({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  // Await the searchParams promise
  const params = await searchParams
  const email = params.email || 'your email'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a confirmation link to <span className="font-medium">{email}</span>
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Didn't receive an email?
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Check your spam folder</li>
                    <li>Make sure you entered the correct email address</li>
                    <li>
                      <button className="font-medium text-blue-600 hover:text-blue-500">
                        Resend confirmation email
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>
              Already verified?{' '}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}