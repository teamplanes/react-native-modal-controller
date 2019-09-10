/// <reference types="react" />
import { ModalControllerProviderProps, ConsumerProps } from "./types";
declare const ModalControllerProvider: (props: ModalControllerProviderProps) => JSX.Element;
declare const useModalController: () => ConsumerProps;
export { ModalControllerProvider, useModalController };
