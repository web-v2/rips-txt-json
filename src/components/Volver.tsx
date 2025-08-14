import { useNavigate } from 'react-router-dom';

function BackToDashboardButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
    >
      <span className="text-xl">←</span>
      Volver al Dashboard
    </button>
  );
}

export default BackToDashboardButton;