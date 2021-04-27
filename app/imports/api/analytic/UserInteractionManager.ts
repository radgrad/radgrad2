
class UserInteractionManager {

  initialize() {
    console.log('initializing user interaction manager');
  }

  updateData() {
    console.log('Updating user interaction data');
  }
}

// A singleton, storing state on what's new.
export const userInteractionManager = new UserInteractionManager();
