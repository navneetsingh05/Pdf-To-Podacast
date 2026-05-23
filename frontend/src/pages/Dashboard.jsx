import UploadPDF from "../components/UploadPDF";
import Navbar from "../components/Navbar";

function Dashboard() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const history = currentUser
    ? [
        {
          title: "Machine Learning Notes",
          time: "2 min ago",
        },

        {
          title: "Operating System Guide",
          time: "15 min ago",
        },

        {
          title: "DBMS Revision",
          time: "30 min ago",
        },
      ]
    : [];

  return (
    <div
      className="
min-h-screen
bg-black
text-white
"
    >
      <Navbar />

      <div
        className="
max-w-7xl
mx-auto
px-6
pt-12
pb-20
"
      >
        {/* TOP SECTION */}

        <div
          className="
grid
lg:grid-cols-2
gap-12
items-center
mb-14
"
        >
          {/* LEFT */}

          <div>
            <div
              className="
inline-flex
px-4
py-2
rounded-full
bg-blue-500/10
border
border-blue-500/20
text-blue-400
mb-6
"
            >
              🎙️ AI Podcast Generator
            </div>

            <h1
              className="
text-5xl
md:text-6xl
font-bold
leading-tight
"
            >
              Convert PDF Into
              <span
                className="
bg-gradient-to-r
from-blue-400
to-purple-500
bg-clip-text
text-transparent
"
              >
                Podcast Audio
              </span>
            </h1>

            <p
              className="
text-gray-400
mt-6
text-lg
leading-8
max-w-xl
"
            >
              Upload PDF files and convert notes ebooks documents into AI
              generated podcast audio. Simple fast and AI powered.
            </p>

            <div
              className="
space-y-4
mt-10
"
            >
              <div
                className="
flex
items-center
gap-4
"
              >
                <div
                  className="
w-10
h-10
rounded-xl
bg-blue-600
flex
justify-center
items-center
"
                >
                  ✓
                </div>

                <p>Upload PDF securely</p>
              </div>

              <div
                className="
flex
items-center
gap-4
"
              >
                <div
                  className="
w-10
h-10
rounded-xl
bg-purple-600
flex
justify-center
items-center
"
                >
                  ✓
                </div>

                <p>AI podcast generation</p>
              </div>

              <div
                className="
flex
items-center
gap-4
"
              >
                <div
                  className="
w-10
h-10
rounded-xl
bg-pink-600
flex
justify-center
items-center
"
                >
                  ✓
                </div>

                <p>Download audio instantly</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
            <div
              className="
bg-gray-900
border
border-gray-800
rounded-3xl
p-8
shadow-2xl
"
            >
              <UploadPDF />
            </div>
          </div>
        </div>

        {/* LOWER GRID */}

        <div
          className="
grid
lg:grid-cols-3
gap-8
"
        >
          {/* HISTORY */}
          {history.length > 0 && (
            <div
              className="
lg:col-span-2
bg-gray-900
border
border-gray-800
rounded-3xl
p-8
"
            >
              <h2
                className="
text-3xl
font-bold
mb-8
"
              >
                Recent History
              </h2>
              <div className="space-y-5">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="
bg-black
border
border-gray-800
rounded-2xl
p-5
flex
justify-between
items-center
"
                  >
                    <div>
                      <p>🎧 {item.title}</p>

                      <p
                        className="
text-gray-500
text-sm
mt-2
"
                      >
                        {item.time}
                      </p>
                    </div>

                    <button
                      className="
bg-blue-600
px-4
py-2
rounded-lg
hover:bg-blue-700
duration-300
"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI STATUS */}

          <div
            className="
bg-gray-900
border
border-gray-800
rounded-3xl
p-8
"
          >
            <h2
              className="
text-2xl
font-bold
mb-6
"
            >
              AI Processing
            </h2>

            <div
              className="
space-y-5
"
            >
              <div>
                <div
                  className="
flex
justify-between
mb-2
"
                >
                  <span>Audio Quality</span>

                  <span>98%</span>
                </div>

                <div
                  className="
bg-gray-800
rounded-full
h-3
"
                >
                  <div
                    className="
bg-blue-500
h-3
rounded-full
w-[98%]
"
                  />
                </div>
              </div>

              <div>
                <div
                  className="
flex
justify-between
mb-2
"
                >
                  <span>AI Script Engine</span>

                  <span>95%</span>
                </div>

                <div
                  className="
bg-gray-800
rounded-full
h-3
"
                >
                  <div
                    className="
bg-purple-500
h-3
rounded-full
w-[95%]
"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;