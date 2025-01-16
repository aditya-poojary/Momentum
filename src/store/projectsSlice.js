import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  filteredProjects: [],
  filter: "All",
  editProject: null,
  isDialogOpen: false,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setProjects: (state, action) => {
      state.projects = action.payload;
      // Initialize filteredProjects with all projects
      state.filteredProjects = action.payload;
    },
    setFilter: (state, action) => {
      state.filter = action.payload;

      // Apply filtering logic based on the selected category
      if (action.payload === "All") {
        state.filteredProjects = state.projects;
      } else {
        state.filteredProjects = state.projects.filter((project) =>
          project.category === action.payload
        );
      }
    },
    setEditProject: (state, action) => {
      state.editProject = action.payload;
    },
    setDialogOpen: (state, action) => {
      state.isDialogOpen = action.payload;
    },
  },
});

export const {
  setProjects,
  setFilter,
  setEditProject,
  setDialogOpen,
} = projectsSlice.actions;

export default projectsSlice.reducer;
