defmodule LiveSvelteSsrWeb.SveltePage do
  use Phoenix.Component
  import Phoenix.HTML

  def render(assigns) do
    ~H"""
    <div id="lj" phx-hook="LiveJSON"></div>
    <div id="index" phx-hook="SvelteHook" data-component-module={"/assets/#{@component_module}"}>
      <%= if @html do %>
        <%= raw(@html) %>
      <% end %>
    </div>
    """
  end
end
