/* eslint-disable import/no-unresolved */
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { initializeRegistryWithDefinitions, View } from "react-native-animatable";
import { Animated, StyleSheet, TouchableWithoutFeedback, Modal } from "react-native";
import { Priority } from "./types";
const defaultBackdrop = {
    activeOpacity: 0.5,
    transitionInTiming: 500,
    transitionOutTiming: 500
};
const defaultAnimation = {
    in: "fadeIn",
    out: "bounceOut",
    inDuration: 500,
    outDuration: 500
};
const Context = createContext({
    modals: [],
    onShowModal: () => { }
});
const modalAnimatorStyles = StyleSheet.create({
    wrapper: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center"
    },
    absoluteWrapper: {
        position: "absolute"
    }
});
const ModalAnimator = (props) => {
    const [isVisible, setVisible] = useState(props.isVisible);
    const isAnimatingOut = useRef(false);
    const viewRef = useRef(null);
    const handleRunAnimation = useCallback(async () => {
        if (isVisible &&
            !props.isVisible &&
            !isAnimatingOut.current &&
            viewRef.current) {
            const animation = {
                ...defaultAnimation,
                ...props.animation
            };
            isAnimatingOut.current = true;
            const animationFn = viewRef.current[animation.out]; // todo: types
            await animationFn(props.animation.outDuration);
            setVisible(false);
            isAnimatingOut.current = false;
            props.onAnimationOutDidEnd();
        }
    }, [isVisible, props]);
    useEffect(() => {
        handleRunAnimation();
    }, [handleRunAnimation]);
    return (React.createElement(View, { pointerEvents: "box-none", style: props.absolutePositioning
            ? [modalAnimatorStyles.absoluteWrapper, props.absolutePositioning]
            : modalAnimatorStyles.wrapper, duration: props.animation.inDuration, animation: props.animation.in, ref: viewRef }, React.cloneElement(props.children)));
};
const modalControllerProviderStyles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "black"
    }
});
const ModalControllerProvider = (props) => {
    const [modals, setModals] = useState([]);
    const backdropOpacity = useRef(new Animated.Value(0));
    const handleBackdropFade = useCallback(() => {
        const visibleModals = modals.filter(({ isVisible }) => isVisible);
        const backdrop = {
            ...defaultBackdrop,
            ...(props.backdrop || {})
        };
        // hide backdrop if the is no modals to display
        if (!visibleModals.length) {
            Animated.timing(backdropOpacity.current, {
                toValue: 0,
                duration: backdrop.transitionOutTiming
            }).start();
        }
        else {
            Animated.timing(backdropOpacity.current, {
                toValue: backdrop.activeOpacity,
                duration: backdrop.transitionInTiming
            }).start();
        }
    }, [modals, props.backdrop]);
    const handleAnimationOutDidEnd = (id) => () => setModals(currentModals => currentModals.filter(modal => modal.id !== id));
    const hideTopModal = () => setModals(currentModals => {
        const newModals = [...currentModals];
        newModals[newModals.length - 1] = {
            ...newModals[newModals.length - 1],
            isVisible: false
        };
        return newModals;
    });
    const hideModalAtIndex = (modalIndex) => setModals(currentModals => {
        const newModals = [...currentModals];
        newModals[modalIndex] = {
            ...newModals[modalIndex],
            isVisible: false
        };
        return newModals;
    });
    const handleShowModal = (config) => {
        const otherModals = config.priority === Priority.Standard
            ? [...modals]
            : modals.map(modal => ({ ...modal, isVisible: false }));
        const configModal = props.modals.find(({ name }) => config.name === name);
        if (!configModal) {
            console.error(`Modal with name ${config.name} not found`);
            return;
        }
        setModals([
            ...otherModals,
            {
                ...configModal,
                id: Math.random().toString(),
                isVisible: true,
                ...config
            }
        ]);
    };
    useEffect(() => {
        if (props.customAnimations) {
            initializeRegistryWithDefinitions(props.customAnimations);
        }
    }, [props.customAnimations]);
    useEffect(() => {
        handleBackdropFade();
    }, [modals, handleBackdropFade]);
    const topModal = modals[modals.length - 1];
    const isCancelable = topModal && topModal.isCancelable;
    const modalConsumerProps = {
        modals,
        onShowModal: handleShowModal
    };
    return (React.createElement(Context.Provider, { value: modalConsumerProps },
        props.children,
        React.createElement(Modal, { transparent: true, animationType: "none", visible: modals.length > 0 },
            React.createElement(TouchableWithoutFeedback, { onPress: isCancelable ? hideTopModal : undefined },
                React.createElement(Animated.View, { style: [
                        modalControllerProviderStyles.backdrop,
                        { opacity: backdropOpacity.current }
                    ] })),
            modals.map(({ Component, ...modal }, index) => (React.createElement(ModalAnimator, { key: modal.id, isVisible: modal.isVisible, absolutePositioning: modal.absolutePositioning, animation: modal.animation, onAnimationOutDidEnd: handleAnimationOutDidEnd(modal.id) },
                React.createElement(Component, Object.assign({}, modalConsumerProps, { params: modal.params, onHideModal: () => hideModalAtIndex(index) }))))))));
};
const useModalController = () => useContext(Context);
export { ModalControllerProvider, useModalController };
