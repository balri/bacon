interface LoadingProps {
	small?: boolean;
}

export default function Loading({ small }: LoadingProps) {
	return (
		<div className={small ? "loading-small-container" : "loading-container"}>
			<div className={small ? "loading-small-spinner" : "loading-spinner"} />
			<div className={small ? "loading-small-text" : "loading-text"}>Loading...</div>
		</div>
	);
}
