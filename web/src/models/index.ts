import { Models } from "@rematch/core";
import { doctorPage } from "./doctorPage";
import { controllerPage } from "./controllerPage";
import { screenPage } from "./screenPage";

export interface RootModel extends Models<RootModel> {
  doctorPage: typeof doctorPage;
  controllerPage: typeof controllerPage; 
  screenPage: typeof screenPage;
}
export const models: RootModel = { doctorPage, controllerPage, screenPage};