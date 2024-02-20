defmodule LiveSvelteSsr.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    {:ok, path} = :application.get_application()
    node_path = Application.app_dir(path, "/priv")

    children = [
      LiveSvelteSsrWeb.Telemetry,
      # LiveSvelteSsr.Repo,
      {DNSCluster, query: Application.get_env(:live_svelte_ssr, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: LiveSvelteSsr.PubSub},
      {LiveSvelteSsr.NodeJS.Supervisor, [path: node_path, pool_size: 4]},
      # Start the Finch HTTP client for sending emails
      {Finch, name: LiveSvelteSsr.Finch},
      # Start a worker by calling: LiveSvelteSsr.Worker.start_link(arg)
      # {LiveSvelteSsr.Worker, arg},
      # Start to serve requests, typically the last entry
      LiveSvelteSsrWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LiveSvelteSsr.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LiveSvelteSsrWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
