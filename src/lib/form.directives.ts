export function ariaValidation(node: HTMLInputElement) {
	const handleChange = () => {
		node.setAttribute('aria-invalid', `${!node.checkValidity()}`);
	};

	node.addEventListener('change', handleChange);

	return {
		destroy() {
			node.removeEventListener('change', handleChange);
		}
	};
}

/**
 * @deprecated replace with use:enhance
 */
export function afterSubmit(
	node: HTMLInputElement | HTMLButtonElement,
	callback: (node: HTMLInputElement | HTMLButtonElement) => void
) {
	const form = node.form;
	if (form == null) {
		throw new Error('Unable to find form element from this node.');
	}
	const listener = () => callback(node);

	form.addEventListener('submit', listener);

	return {
		destroy() {
			form.removeEventListener('submit', listener);
		}
	};
}

export function setBusy(node: HTMLButtonElement, isBusy = true) {
	node.disabled = true;
	node.setAttribute('aria-busy', `${isBusy}`);
}
