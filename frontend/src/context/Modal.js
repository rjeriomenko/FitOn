import './Modal.css';

import { createContext } from "react";
import { useContext } from "react"
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

const ModalContext = createContext();

export const ModalProvider = (props) => {
	const modalRef = useRef(null);
	const [value, setValue] = useState();
	useEffect(() => {
		// Need to setValue after first render because when a ref is passed as a
		//  `ref` prop to a React component, that component assigns itself
		//  to `someRef.current` only after React creates that component's DOM node and places on screen.
		// This means after its first render(?)
		setValue(modalRef.current);
	} ,[])


	return (
		<div>
			<ModalContext.Provider value={value} >
				{/* What happens if we don't explicitly do below...? Do children not render? */}
				{props.children} 
			</ModalContext.Provider>
			<div ref={modalRef} >

			</div>
		</div>
	)
}

export const Modal = ({onClose, children}) => {
	const modalNode = useContext(ModalContext);

	if(!modalNode) return null;

	return createPortal(
		<div id="modal">
			<div id="modal-background" onClick={onClose}></div>
			<div id="modal-content">
				{children}
			</div>
		</div>,
		modalNode
	)
}