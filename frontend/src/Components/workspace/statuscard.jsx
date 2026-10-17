import "./statuscard.css";

function StatusCard({ title, value, icon, bgColor }) {
    return (
        <div className={`status-card ${bgColor || ""}`}>
            <div className="status-card__text">
                <p className="status-card__title">{title}</p>
                <h3 className="status-card__value">{value}</h3>
            </div>

            <div className="status-card__icon">
                {icon}
            </div>
        </div>
    );
}

export default StatusCard;