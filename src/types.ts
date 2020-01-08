/* eslint-disable import/no-unresolved */
import React from "react";
import {
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  ModalProps
} from "react-native";
import { CustomAnimation, Animation } from "react-native-animatable";

export enum Priority {
  Standard,
  Override
}

export interface AnimationConfig {
  in?: Animation;
  out?: Animation;
  inDuration?: number;
  outDuration?: number;
}

export interface BackdropConfig {
  activeOpacity?: number;
  transitionInTiming?: number;
  transitionOutTiming?: number;
}

export interface ModalType {
  id: string;
  name: string;
  priority?: Priority;
  isVisible: boolean;
  isCancelable?: boolean;
  Component: any;
  absolutePositioning?: StyleProp<ViewStyle>;
  animation: AnimationConfig;
  params?: Record<string, any>;
  supportedOrientations?: ModalProps["supportedOrientations"];
}

export interface ConsumerProps {
  modals: ModalType[];
  onShowModal: (config: ShowModalConfig) => void;
}

export interface ModalComponentProps<Params extends Record<string, any>>
  extends ConsumerProps {
  params: Params;
  onHideModal: () => void;
}

export interface ModalControllerProviderProps {
  modals: Omit<ModalType, "id" | "isVisible">[];
  backdrop?: BackdropConfig;
  customAnimations?: {
    [key: string]: CustomAnimation<TextStyle & ViewStyle & ImageStyle>;
  };
  children: React.ReactChild;
  supportedOrientations?: ModalProps["supportedOrientations"];
}

export type ShowModalConfig = Partial<ModalType> & Pick<ModalType, "name">;

export interface ModalAnimatorProps {
  animation: ModalType["animation"];
  isVisible: ModalType["isVisible"];
  absolutePositioning?: ModalType["absolutePositioning"];
  children: React.ReactElement;
  onAnimationOutDidEnd: () => void;
}
