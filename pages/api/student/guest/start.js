import { wrapMutatingApi } from "../../../../lib/global/apply-write-barrier.js";
import { createGuestStartHandler } from "../../../../lib/guest/guest-start-handler.server.js";

export { createGuestStartHandler };

export default wrapMutatingApi(createGuestStartHandler());
