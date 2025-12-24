import CrossIcon from "@/icons/CrossIcon";

export default function Modal({
  children,
  closeModal,
}: {
  children: React.ReactNode;
  closeModal: () => void;
}) {
  return (
    <div className="fixed top-0 left-0 bg-black/30 h-screen w-screen flex justify-center items-center">
      <div className="bg-white w-110 p-5 rounded-xl shadow-xl border border-slate-200">
        <div className="flex flex-row-reverse mb-6">
          <div
            onClick={closeModal}
            className="hover:bg-slate-200 transition-all duration-100 ease-in-out hover:scale-102 hover:-translate-y-0.5 cursor-pointer rounded-full px-2 py-2"
          >
            <CrossIcon />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
