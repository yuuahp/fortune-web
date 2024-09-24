import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";

export function FlyoutButton({className, children, name, icon, open, setOpen, disabled}: {
    className?: string,
    children?: ReactNode,
    name: string,
    icon: IconDefinition,
    open: boolean,
    setOpen: (open: boolean) => void,
    disabled?: boolean
}) {
    const buttonRef = useRef<HTMLDivElement>(null)
    const flyoutRef = useRef<HTMLDivElement>(null)
    const boundaryRef = useRef<HTMLDivElement>(null)

    const [flyoutStyles, setFlyoutStyles] = useState<CSSProperties>({})

    const [flyoutVisible, setFlyoutVisible] = useState(false)

    window.onresize = calculateFlyoutStyles
    useEffect(calculateFlyoutStyles, [open]);

    function calculateFlyoutStyles() {
        if (!open) {
            setFlyoutVisible(false)
            return
        }

        const buttonRect = buttonRef.current?.getBoundingClientRect()
        const flyoutRect = flyoutRef.current?.getBoundingClientRect()
        const boundaryRect = boundaryRef.current?.getBoundingClientRect()

        if (!buttonRect || !flyoutRect || !boundaryRect) return

        const newFlyoutStyles: CSSProperties = {}

        const flyoutCenterLeft = (buttonRect.left - boundaryRect.left) + buttonRect.width / 2 - flyoutRect.width / 2

        if (flyoutCenterLeft < 0) {
            newFlyoutStyles.left = `0`
        } else if (flyoutCenterLeft + flyoutRect.width > boundaryRect.width) {
            newFlyoutStyles.right = `0`
        } else {
            newFlyoutStyles.left = `${flyoutCenterLeft}px`
        }

        if (buttonRect.y < (window.innerHeight / 2)) {
            // flyout should be below the button
            newFlyoutStyles.top = `calc(${buttonRect.bottom - boundaryRect.top}px + .5rem)`
            newFlyoutStyles.maxHeight = `calc(${(boundaryRect.bottom) - (buttonRect.bottom)}px - .5rem)`
        } else {
            // flyout should be above the button
            newFlyoutStyles.bottom = `calc(${boundaryRect.bottom - buttonRect.top}px + .5rem)`
            newFlyoutStyles.maxHeight = `calc(${buttonRect.top - boundaryRect.top}px - .5rem)`
        }

        setFlyoutStyles(newFlyoutStyles)

        setFlyoutVisible(true)
    }

    return (
        <div className={`${className}`}>
            <div ref={buttonRef}
                 className={`
                 group/fp-button bg-zinc-800 ${!disabled && 'cursor-pointer hover:bg-zinc-700 active:mr-1'}
                 select-none transition-all
                 py-1 px-4 rounded-full font-bold text-nowrap
                 `}
                 onClick={event => {
                     event.stopPropagation()
                     if (disabled) return
                     setOpen(!open)
                 }}>
                {!disabled && name}
                <FontAwesomeIcon icon={icon}
                                 className={`${!disabled && 'ml-2 group-active/fp-button:ml-1'} transition-all ${disabled && 'text-zinc-500'}`}/>
            </div>
            {
                open &&
                <div onClick={() => setOpen(false)}
                     className="fixed z-10 w-screen h-screen p-2 top-0 left-0">
                    <div ref={boundaryRef} className="relative w-full h-full">
                        <div ref={flyoutRef} style={flyoutStyles} onClick={event => event.stopPropagation()}
                             className={`
                             absolute p-4 max-w-full
                             overflow-y-scroll
                             bg-zinc-900 shadow-2xl rounded-lg 
                             border border-zinc-800 
                             transition-opacity ${flyoutVisible ? 'opacity-100' : 'opacity-0'}
                             `}>
                            {children}
                        </div>
                    </div>
                </div>
            }
        </div>

    )
}