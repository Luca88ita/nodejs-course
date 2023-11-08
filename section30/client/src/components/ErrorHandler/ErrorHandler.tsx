import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";

interface Props {
  error: any;
  onHandle: () => void;
}

const errorHandler = ({ error, onHandle }: Props) => {
  return (
    <>
      {error && <Backdrop onClick={onHandle} />}
      {error && (
        <Modal
          title="An Error Occurred"
          onCancelModal={onHandle}
          onAcceptModal={onHandle}
          acceptEnabled
        >
          <p>{error.message}</p>
        </Modal>
      )}
    </>
  );
};

export default errorHandler;
