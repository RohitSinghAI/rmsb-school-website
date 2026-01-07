import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "./features/adminAuth/adminAuthSlice";
import { adminAuthApi } from "./features/adminAuth/adminAuthApi";
import { sliderApi } from "./features/home/sliderApi";
import { schoolHighlightApi } from "./features/home/schoolHighlightsApi";
import { statsApi } from "./features/home/statsApi";
import { upcomingEventApi } from "./features/home/upcomingEventApi";
import { facultyApi } from "./features/teacher/page";
import { testimonialsApi } from "./features/home/testimonialApi";
import { principalApi } from "./features/about/principalApi";
import { aboutUsApi } from "./features/about/aboutUsApi";
import { missionVisionValuesApi } from "./features/about/missionVisionValuesApi";
import { journeyTimelineApi } from "./features/about/journeyTimelineApi";
import { programsCurriculumApi } from "./features/about/programsCurriculumApi";
import { contactInfoApi } from "./features/contact/contactInfoApi";
import { facilityApi } from "./features/about/facilityApi";
import { contactApi } from "./features/contact/contactApi";
import { galleryApi } from "./features/gallery/galleryImagesApi";
import { navbarApi } from "./features/navbar/page";



export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    //navbar page
    [navbarApi.reducerPath]: navbarApi.reducer,
    //home page
    [sliderApi.reducerPath]: sliderApi.reducer,
    [schoolHighlightApi.reducerPath]: schoolHighlightApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [upcomingEventApi.reducerPath]: upcomingEventApi.reducer,
    [testimonialsApi.reducerPath]: testimonialsApi.reducer,

    //about
    [principalApi.reducerPath]: principalApi.reducer,
    [aboutUsApi.reducerPath]: aboutUsApi.reducer,
    [missionVisionValuesApi.reducerPath]: missionVisionValuesApi.reducer,
    [journeyTimelineApi.reducerPath]: journeyTimelineApi.reducer,
    [programsCurriculumApi.reducerPath]: programsCurriculumApi.reducer,
    [facilityApi.reducerPath]: facilityApi.reducer,

    //teacher
    [facultyApi.reducerPath]: facultyApi.reducer,

    //gallery
    [galleryApi.reducerPath]: galleryApi.reducer,

    //Contact
    [contactInfoApi.reducerPath]: contactInfoApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(adminAuthApi.middleware)
      //navbar
      .concat(navbarApi.middleware)
      //home
      .concat(sliderApi.middleware)
      .concat(schoolHighlightApi.middleware)
      .concat(statsApi.middleware)
      .concat(upcomingEventApi.middleware)
      .concat(testimonialsApi.middleware)
      //about
      .concat(principalApi.middleware)
      .concat(aboutUsApi.middleware)
      .concat(missionVisionValuesApi.middleware)
      .concat(journeyTimelineApi.middleware)
      .concat(programsCurriculumApi.middleware)
      .concat(facilityApi.middleware)
      // teacher
      .concat(facultyApi.middleware)
      // gallery
      .concat(galleryApi.middleware)
      // contact
      .concat(contactInfoApi.middleware)
      .concat(contactApi.middleware)

});
