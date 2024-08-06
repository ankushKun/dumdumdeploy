declare module 'ansi-to-react' {
    import * as React from 'react';

    interface AnsiProps {
        linkify?: boolean;
        className?: string;
        useClasses?: boolean;
        children?: string;
    }

    const Ansi: React.FC<AnsiProps>;

    export default Ansi;
}