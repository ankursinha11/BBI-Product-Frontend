interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded: () => void;
}

const AddUserModal = ({ isOpen, onClose, onUserAdded }: AddUserModalProps) => {
  return (
    <div>
      {/* Your modal implementation */}
    </div>
  );
};

export default AddUserModal; 