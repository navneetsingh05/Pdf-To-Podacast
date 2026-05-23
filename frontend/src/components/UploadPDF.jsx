import { useState } from "react";

function UploadPDF() {
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  function handleChange(e) {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
    }
  }
  async function generatePodcast() {
    console.log("Button Clicked");
    if (!selectedFile) {
      alert("Upload PDF First");
      return;
    }
    const formData = new FormData();
    formData.append("pdf", selectedFile);
    const response = await fetch(
      "http://localhost:8000/api/generate",

      {
        method: "POST",

        body: formData,
      },
    );

    const data = await response.json();

    console.log(data);

    alert(data.message);
  }

  return (
    <div
      className="
w-full
max-w-xl
bg-gradient-to-br
from-gray-900
to-black
border
border-gray-800
rounded-3xl
p-8
shadow-2xl
"
    >
      <div
        className="
text-center
mb-8
"
      >
        <div
          className="
w-20
h-20
mx-auto
rounded-3xl
bg-gradient-to-r
from-blue-600
to-purple-600
flex
items-center
justify-center
text-4xl
mb-5
"
        >
          📄
        </div>

        <h2
          className="
text-3xl
font-bold
text-white
"
        >
          Upload PDF
        </h2>

        <p
          className="
text-gray-400
mt-3
"
        >
          Convert PDFs into AI Podcasts
        </p>
      </div>

      <label
        className="
block
border-2
border-dashed
border-gray-700
hover:border-blue-500
duration-300
rounded-2xl
p-10
cursor-pointer
bg-black/40
"
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
        />

        <div
          className="
text-center
"
        >
          <div
            className="
text-5xl
mb-4
"
          >
            ⬆️
          </div>

          <p className="font-semibold text-lg">Click To Upload PDF</p>

          <p className="text-gray-500 mt-2">Only PDF files supported</p>
        </div>
      </label>

      {fileName && (
        <div
          className="
mt-6
bg-black
border
border-gray-800
rounded-xl
p-4
flex
justify-between
items-center
"
        >
          <p
            className="
text-gray-300
truncate
"
          >
            📄 {fileName}
          </p>

          <span
            className="
text-green-400
"
          >
            Ready
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={generatePodcast}
        className="
w-full
mt-8
bg-gradient-to-r
from-blue-600
to-purple-600
py-4
rounded-xl
font-bold
hover:scale-[1.02]
duration-300
"
      >
        Generate Podcast 🎙️
      </button>
    </div>
  );
}

export default UploadPDF;
