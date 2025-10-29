import { ArrowLeft, AttachFile, CloudUpload } from "@mui/icons-material";
import { useState } from "react";
import Button from "../Button";

interface AttachExamProps {
  onClose?: () => void;
  onComplete: (file: File | null) => void;
}

function AttachExam({ onClose, onComplete }: AttachExamProps) {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
    };

    const handleSubmit = () => {
        if (file) {
            onClose?.();
            onComplete(file);
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col h-screen w-full font-sans">
            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
                <Button onClick={onClose}>
                    ← 
                </Button>
                <h1 className="text-xl font-bold text-gray-800">Anexar Exame</h1>
                <div className="bg-teal-500 p-2 rounded-full">
                <AttachFile width={20} className="text-white" />
                </div>
            </div>

            <div className="flex-grow p-4">
                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    <div>
                        <p className="text-sm text-gray-600 list-item ml-4">
                        Solicitado dia 01/03/2025
                        </p>
                    </div>

                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center bg-teal-400 text-white w-full h-48 rounded-lg cursor-pointer hover:bg-teal-500 transition-colors duration-300"
                    >
                        <CloudUpload />
                        <span className="mt-2 text-lg font-bold tracking-wider">ANEXAR</span>
                    </label>

                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    {file && (
                        <div className="text-center text-gray-700">
                        <p>Arquivo: <span className="font-medium">{file.name}</span></p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!file}
                        className="w-full bg-green-400 text-black font-bold py-3 rounded-lg hover:bg-green-500 transition-colors duration-300 disabled:bg-gray-900 disabled:cursor-not-allowed"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AttachExam;