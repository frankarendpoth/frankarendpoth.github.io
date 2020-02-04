<# Idle Alert by Frank Poth 2019-04-19 #>

Add-Type -AssemblyName System.Windows.Forms

(Get-Host).UI.RawUI.WindowTitle = "Idle Alert"
(Get-Host).ui.rawui.BackgroundColor = [System.consolecolor]::Black

[System.Console]::BufferWidth  = [System.Console]::WindowWidth  = 40
[System.Console]::BufferHeight = [System.Console]::WindowHeight = 10

$wait_time = 600 <# 600 seconds is 10 minutes #>
$check_time = 30 <# How often to check for mouse input changes #>

$start_time = Get-Date -UFormat %s
$elapsed_time = 0

(Get-Host).ui.rawui.BackgroundColor = [System.consolecolor]::Black
Clear-Host
Write-Host "Idle Alert will help you keep your computer awake!"

$old_mouse = [System.Windows.Forms.Cursor]::Position

Start-Sleep -Seconds $check_time

while($true) {

  $elapsed_time = (Get-Date -UFormat %s) - $start_time

  $new_mouse = [System.Windows.Forms.Cursor]::Position

  if ($old_mouse.x -eq $new_mouse.x -and $old_mouse.y -eq $new_mouse.y) {

    if ($elapsed_time -gt $wait_time) {

      $red = 0

      while($true) {

        $new_mouse = [System.Windows.Forms.Cursor]::Position

        if ($new_mouse.x -ne $old_mouse.x -or $new_mouse.y -ne $old_mouse.y) {

          (Get-Host).ui.rawui.BackgroundColor = [System.consolecolor]::Black
	  Clear-Host
	  Write-Host "Sleep Avoided!"
          break

        }

        if ($red -eq 0) {

          (Get-Host).ui.rawui.BackgroundColor = [System.consolecolor]::Red
          $red = 1

        } else {

          (Get-Host).ui.rawui.BackgroundColor = [System.consolecolor]::White
          $red = 0

        }

        Clear-Host
        Write-Host "WARNING!!!"

        Start-Sleep -Seconds 1

      }

    } else {

      Write-Host "Idle for"([System.Math]::Round($elapsed_time))"seconds"

    }

    <#$prompt = [System.Windows.Forms.MessageBox]::Show("Your PC is idle!!!", "WARNING")#>

  } else {

    $old_mouse = [System.Windows.Forms.Cursor]::Position
    $start_time = Get-Date -UFormat %s

    Write-Host "The Mouse Has Moved"

  }

  Start-Sleep -Seconds $check_time

}