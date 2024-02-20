defmodule LiveSvelteSsrWeb.LiveHelpers do
  import Phoenix.Component, only: [assign: 3]
  require Logger
  alias LiveSvelteSsr.LiveJson

  def svelte_page_mount(socket, prop_assigns \\ [], ctx_assigns \\ []) do
    tracked_assigns = prop_assigns ++ ctx_assigns

    if :component_module not in Map.keys(socket.assigns) do
      throw("No :component_module in socket.assigns")
    end

    socket =
      if Phoenix.LiveView.connected?(socket) do
        socket
        |> assign(:html, nil)
      else
        props = Map.take(socket.assigns, prop_assigns)
        ctx = Map.take(socket.assigns, ctx_assigns)

        case LiveSvelteSsr.NodeJS.call({"./ssrSvelte.js", "renderPage"}, [
               "./#{socket.assigns.component_module}",
               props,
               ctx
             ]) do
          {:ok, %{"html" => html}} ->
            assign(socket, :html, html)

          {:error, error} ->
            Logger.error(
              "Error doing SSR of page #{socket.assigns.component_module} : #{inspect(error)}"
            )

            assign(socket, :html, nil)
        end
      end

    push_json_data_init(socket, tracked_assigns)
  end

  defp push_json_data_init(socket, assigns_to_track \\ [], doc_name \\ "svelte_page_props") do
    data = Map.take(socket.assigns, assigns_to_track)
    LiveJson.initialize(socket, doc_name, data)
  end

  def push_json_data_patch(socket, assigns_to_track \\ [], doc_name \\ "svelte_page_props") do
    data = Map.take(socket.assigns, assigns_to_track)
    LiveJson.push_patch(socket, doc_name, data)
  end
end
