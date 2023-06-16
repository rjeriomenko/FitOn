import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const formatTwoDigitNumberString = (unformattedNum) => {
	// In case listing is not yet defined, and therefore cannot read its id yet until after component initial render
	if(!unformattedNum) return "01";
	const formattedNum = unformattedNum.toString();
	return formattedNum.length < 2 ? "0".concat(formattedNum) : formattedNum;
}

export const ScrollToTop = () => {
	const { pathname } = useLocation();
	useEffect(() => {
		window.scrollTo(0,0);
	}, [pathname])
	return null;
}