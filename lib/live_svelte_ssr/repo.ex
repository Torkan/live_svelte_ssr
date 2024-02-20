defmodule LiveSvelteSsr.Repo do
  use Ecto.Repo,
    otp_app: :live_svelte_ssr,
    adapter: Ecto.Adapters.Postgres
end
