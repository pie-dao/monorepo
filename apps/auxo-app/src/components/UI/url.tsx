const ExternalUrl: React.FC<{ to: string }> = ({ children, to }) => (
    <a
        href={to}
        target="_blank"
        rel="noreferrer noopener"
    >
    { children }
    </a>
)

export default ExternalUrl