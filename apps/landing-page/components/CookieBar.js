import cookieCutter from 'cookie-cutter';
import content from '../content/en_EN.json';
import styles from '../styles/CookieModal.module.scss';

const CookieModal = ({ isOpen, setIsOpen }) => {
  const closeModal = () => {
    cookieCutter.set('cookiePolicy', 'accepted');
    setIsOpen(false);
  };

  return isOpen ? (
    <div
      className={`text-white flex fixed z-50 bottom-0 right-0 flex-col w-full p-3 border-t-2 border-transparent ${styles.gradient}`}
    >
      <div className="container mx-auto px-6">
        <div className="flex flex-col gap-y-2 md:flex-row items-baseline justify-between">
          <div className="mb-2 md:mb-0">
            <p className="text-sm md:text-md">{content.cookies.description}</p>
          </div>
          <div>
            <button
              type="button"
              className="py-2 px-8 rounded leading-5 bg-highlight border-2 border-highlight font-bold hover:bg-primary"
              onClick={closeModal}
            >
              {content.cookies.button}
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default CookieModal;
