defmodule LiveSvelteSsrWeb.IndexLive do
  alias LiveSvelteSsrWeb.LiveHelpers
  use LiveSvelteSsrWeb, :live_view

  @prop_assigns [:number]
  @ctx_assigns [:locale]

  def render(assigns) do
    ~H"""
    <LiveSvelteSsrWeb.SveltePage.render component_module={@component_module} html={@html} />
    """
  end

  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> assign(:component_module, "svelte/pages/index.js")
     |> assign(:number, 42)
     |> assign(:locale, "en")
     |> LiveHelpers.svelte_page_mount(@prop_assigns, @ctx_assigns)}
  end
end
