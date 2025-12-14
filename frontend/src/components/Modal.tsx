type Props = {
    onClose: () => void;
    children: React.ReactNode;
};

export default function Modal({ onClose, children }: Props) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal"
                onClick={e => e.stopPropagation()}
            >
                <button
                    className="modal-close"
                    onClick={onClose}
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}