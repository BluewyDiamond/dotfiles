export let AstalWp: typeof import("gi://AstalWp").default | null = null;

try {
   AstalWp = (await import("gi://AstalWp")).default;
} catch (error) {
   console.log("weeee");
}
