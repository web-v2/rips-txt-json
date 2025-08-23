import { useNavigate } from 'react-router-dom';

function BackToDashboardButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
    >
      <span className="text-xl">←</span>
      Volver al Dashboard
    </button>
  );
}

export default BackToDashboardButton;