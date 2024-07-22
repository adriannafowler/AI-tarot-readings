import React, { useState } from "react";
import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    } from "@floating-ui/react";
import './tooltip.css'

    const Tooltip = ({ children, content }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [offset({ mainAxis: -25, crossAxis: -100 }), flip(), shift()],
        whileElementsMounted: autoUpdate,
    });


    const hover = useHover(context, { move: false });
    const focus = useFocus(context);
    const dismiss = useDismiss(context);
    const role = useRole(context, {
        role: "tooltip",
    });

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ]);

    return (
        <>
        <div ref={refs.setReference} {...getReferenceProps()}>
            {children}
        </div>
        {isOpen && (
            <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="tooltip-content tooltip-left"
            >
            {content}
            </div>
        )}
        </>
    );
};

export default Tooltip;
