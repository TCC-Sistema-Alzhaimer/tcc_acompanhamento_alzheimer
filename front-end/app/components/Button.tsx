import { Link, type LinkProps } from "react-router";

interface ButtonProps {
    to?: LinkProps["to"];
    type?: "submit" | "reset" | "button";
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
}


function Button({to, type, children, onClick, className = "" }: ButtonProps) {

    const classes = `px-4 py-2 bg-primary text-white rounded hover:bg-green-600 cursor-pointer transition-colors duration-200 ${className}`;

    if (to) {
        return (
        <Link to={to} onClick={onClick} className={classes}>
            {children}
        </Link>
        );
    }

    return (
        <button
            type={type}
            onClick={onClick}
            className={classes}
        >
            {children}
        </button>
    );
}

export default Button;