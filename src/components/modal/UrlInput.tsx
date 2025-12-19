import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export function UrlInput(
    props: DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >,
) {
    return (
        <div>
            <input
                {...props}
                type='url'
                className='my-2 bg-surface border border-border text-text text-sm rounded-theme focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-surface dark:border-border dark:placeholder-muted dark:text-text dark:focus:ring-primary dark:focus:border-primary'
                placeholder='www.example.com'
                required
            />
        </div>
    );
}
