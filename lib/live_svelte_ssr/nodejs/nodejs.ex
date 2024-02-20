defmodule LiveSvelteSsr.NodeJS do
  def start_link(opts \\ []), do: LiveSvelteSsr.NodeJS.Supervisor.start_link(opts)
  def stop(), do: LiveSvelteSsr.NodeJS.Supervisor.stop()

  def call(module, args \\ [], opts \\ []),
    do: LiveSvelteSsr.NodeJS.Supervisor.call(module, args, opts)

  def call!(module, args \\ [], opts \\ []),
    do: LiveSvelteSsr.NodeJS.Supervisor.call!(module, args, opts)
end
