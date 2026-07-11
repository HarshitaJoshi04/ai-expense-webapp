"use client";

// Why this file exists:
// This component provides the drag-and-drop or file-selector interface for receipt scanning.
// It uses a hidden native HTML file input bound to a premium-styled label.
// When the user selects a file, it calls the `uploadReceipt` handler.
//
// React Concepts:
// - Two-step binding: Label clicks programmatically trigger the hidden `<input type="file">`.
// - Image Previews: The file is converted into a local blob URL using `URL.createObjectURL(file)`
//   and rendered immediately to avoid layout pop once the image uploads.

const ReceiptUploadCard = ({
  uploadReceipt,
  receiptImage,
}: any) => {


  return (
    <div className="bg-white dark:bg-[#111625] rounded-3xl p-6 w-full transition-all duration-300">
      
      {/* TITLE */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-gray-200">
          Upload Receipt
        </h2>
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase tracking-wider">
          AI Auto-scan
        </span>
      </div>

      {/* DROPZONE CONTAINER */}
      <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-400 rounded-2xl p-6 text-center transition-all duration-300 bg-slate-50/50 dark:bg-white/[0.01] hover:bg-slate-50 dark:hover:bg-white/[0.02] flex flex-col justify-center items-center">
        
        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          accept="image/*"
          id="receipt-file-upload"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              uploadReceipt(file);
            }
          }}
        />

        {/* CUSTOM LABEL */}
        <label
          htmlFor="receipt-file-upload"
          className="cursor-pointer w-full flex flex-col items-center justify-center space-y-3 py-4"
        >
          {/* UPLOAD CLOUD ICON */}
          <div className="p-3 bg-purple-500/10 dark:bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-600 dark:text-purple-400 transition-transform duration-200 group-hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-200">
              Click to select receipt
            </p>
            <p className="text-[10px] text-slate-400 dark:text-gray-500">
              Supports JPEG, JPG, PNG
            </p>
          </div>
        </label>

        {/* IMAGE PREVIEW FRAME */}
        {receiptImage && (
          <div className="mt-5 pt-5 border-t border-slate-200/60 dark:border-white/5 w-full flex flex-col items-center">
            <span className="text-[9px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-2">
              Receipt Preview
            </span>
            <div className="relative group rounded-xl overflow-hidden shadow-md border border-slate-200/50 dark:border-white/10 max-w-[180px]">
              <img
                src={receiptImage}
                alt="Receipt"
                className="w-full h-auto object-cover max-h-[200px]"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <span className="text-[9px] text-white bg-slate-900/80 px-2 py-1 rounded font-bold uppercase tracking-wider">
                  Replace File
                </span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

export default ReceiptUploadCard;