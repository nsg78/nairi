local isOpen = false

local function openNairi()
    isOpen = true
    SetNuiFocus(true, true)
    SendNUIMessage({ action = 'open' })
end

local function closeNairi()
    isOpen = false
    SetNuiFocus(false, false)
    SendNUIMessage({ action = 'close' })
end

RegisterCommand('nairi', function()
    if isOpen then closeNairi() else openNairi() end
end, false)

RegisterKeyMapping('nairi', 'Ouvrir Nairi Corporation', 'keyboard', 'F6')

RegisterNUICallback('close', function(_, cb)
    closeNairi()
    cb({ ok = true })
end)

-- Exemple : le serveur / téléphone peut ouvrir l'app avec cet event.
RegisterNetEvent('nairi:open', function()
    openNairi()
end)
