import { useTheme } from '../context/ThemeContext';
import './DarkModeToggle.css';

export default function DarkModeToggle() {
    const { dark, toggle } = useTheme();
    return (
        <button
            className={`dm-toggle ${dark ? 'dm-dark' : 'dm-light'}`}
            onClick={toggle}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle dark mode"
        >
            <span className="dm-track">
                <span className="dm-thumb">
                    {dark ? '🌙' : '☀️'}
                </span>
            </span>
        </button>
    );
}
