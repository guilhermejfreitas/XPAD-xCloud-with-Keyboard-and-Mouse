let CAN_SET_BUTTON = {can: false, button_id: null};

const DEFAULT_GAMEPAD_CONFIG = {
    profiles:[
        {
            name:'Default',
            mapped_buttons:{
                a_button:'Enter'
            }
        }
    ]
}

const InitExtension = () => {
    const gamepad_config = localStorage.getItem('GAMEPAD_CONFIG');
    if (!gamepad_config){

        localStorage.setItem('GAMEPAD_CONFIG', JSON.stringify(DEFAULT_GAMEPAD_CONFIG));

        chrome.runtime.sendMessage({
            action: "setLocalStorage",
            key: "GAMEPAD_CONFIG",
            value: JSON.stringify(DEFAULT_GAMEPAD_CONFIG),
        });

    }
}

const LoadConfigOnSite = () => {

    const gamepad_config = GetGamepadConfig();

    console.log(gamepad_config)

    chrome.runtime.sendMessage({
        action: "setLocalStorage",
        key: "GAMEPAD_CONFIG",
        value: JSON.stringify(gamepad_config),
    });
}

const GetGamepadConfig = () => {
    const gamepad_config = localStorage.getItem('GAMEPAD_CONFIG');
    if (!gamepad_config){

        localStorage.setItem('GAMEPAD_CONFIG', JSON.stringify(DEFAULT_GAMEPAD_CONFIG));

        chrome.runtime.sendMessage({
            action: "setLocalStorage",
            key: "GAMEPAD_CONFIG",
            value: JSON.stringify(DEFAULT_GAMEPAD_CONFIG),
        });

        return DEFAULT_GAMEPAD_CONFIG;
    }
    return JSON.parse(gamepad_config);
}

const SetProfileButtons = (profile, mapped_buttons) => {
    const gamepad_config = GetGamepadConfig();
    const profiles = gamepad_config.profiles;
    for (const profile_ of profiles){
        if (profile == profile_.name){
            profile_.mapped_buttons = mapped_buttons;
        }
    }

    gamepad_config.profiles = profiles;

    localStorage.setItem('GAMEPAD_CONFIG', JSON.stringify(gamepad_config));

    chrome.runtime.sendMessage({
        action: "setLocalStorage",
        key: "GAMEPAD_CONFIG",
        value: JSON.stringify(gamepad_config),
    });
}

const GetProfile = () => {
    const profiles = document.getElementById("profiles");
    const profile = profiles.value;
    return profile;
}

const SetButton = (key) => {
    if (CAN_SET_BUTTON.can){
        
        const gamepad_config = GetGamepadConfig();

        const profiles = gamepad_config.profiles;

        for (const profile of profiles){

            const profile_ = GetProfile();

            if (profile.name == profile_){

                console.log(CAN_SET_BUTTON.button_id);
                console.log(profile.mapped_buttons[CAN_SET_BUTTON.button_id])

                profile.mapped_buttons[CAN_SET_BUTTON.button_id] = key;

                SetProfileButtons(profile_, profile.mapped_buttons);
            }

        }

        CAN_SET_BUTTON.can = false;
        CAN_SET_BUTTON.button_id = null;
    }

    console.log(GetGamepadConfig())
}

document.addEventListener('keydown', (event) => {
    SetButton(event.key);
});

function MapButton(button_id, key){

    /*chrome.runtime.sendMessage({
        action: "setLocalStorage",
        key: "CONFIG",
        value: "meuValor",
    });
    
    localStorage.setItem('minhaChave', 'meuValor');*/
}

function handleClick(event) {
    CAN_SET_BUTTON.can = true;
    CAN_SET_BUTTON.button_id = event.target.id;
}
  
const select_buttons = document.querySelector(".set-button");
  
select_buttons.addEventListener("click", handleClick);

InitExtension();

setInterval(()=>{
    LoadConfigOnSite();
    const data = {};
    data["GAMEPAD_CONFIG"] = JSON.stringify(GetGamepadConfig());

  // Salva os dados no localStorage da extensão
  chrome.storage.local.set(data, function () {
    console.log("Valor salvo no localStorage da extensão:", valor);
  });
}, 1000);