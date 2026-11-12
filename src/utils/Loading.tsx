interface LoadingProps {
	small?: boolean;
	tiny?: boolean;
}

export default function Loading({ small, tiny }: LoadingProps) {
	let containerClass = "loading-container";
	let spinnerClass = "loading-spinner";
	let textClass = "loading-text";
	let text = "Loading...";

	if (tiny) {
		containerClass = "loading-tiny-container";
		spinnerClass = "loading-tiny-spinner";
		textClass = "loading-tiny-text";
		text = "";
	} else if (small) {
		containerClass = "loading-small-container";
		spinnerClass = "loading-small-spinner";
		textClass = "loading-small-text";
	}

	return (
		<div className={containerClass}>
			<div className={spinnerClass} />
			{text && <div className={textClass}>{text}</div>}
		</div>
	);
}
