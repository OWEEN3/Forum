import classes from './Button.module.css';

export default function Button({children, isActive = false, ...props}){
    return(
        <button
        {...props}
        className={isActive  ? `${classes.button} ${classes.active}` : classes.button}
        >
            {children}
        </button>
    )
}