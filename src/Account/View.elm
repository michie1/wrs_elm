module Account.View exposing (render, login, logout, signup)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)

import Html exposing (Html, h2, i, label, button, nav, div, text, span, a, input, ul, li)
import Html.Attributes exposing (class, type_, id, for, class, disabled, href)
import Html.Events exposing (onClick, onInput)

login : App -> Html App.Msg.Msg
login app =
    div [] 
        [ h2 [] [ text "Login" ]
        , div []
                [ div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.AccountLoginName
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                {-- , div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "password"
                            , type_ "password"
                            , onInput App.Msg.AccountLoginPassword
                            ]
                            []
                        , label [ for "password" ] [ text "Password" ]
                        ]
                    ]
                --}
                ]
        , button
            [ class "waves-effect waves-light btn"
            , type_ "submit"
            , onClick (App.Msg.AccountLogin)
            , Html.Attributes.name "action"
            --, disabled submitDisabled
            ]
            [ text "Login"
            , i [ class "material-icons right" ] [ text "send" ]
            ]
        ]

logout : App -> Html App.Msg.Msg
logout app = 
    case app.account of
        Just account -> 
            button
                [ class "waves-effect waves-light btn"
                , type_ "submit"
                , onClick (App.Msg.AccountLogout)
                , Html.Attributes.name "action"
                ]
                    [ text "Logout"
                    , i [ class "material-icons right" ] [ text "send" ]
                    ]
                
                    
        Nothing ->
            span [] [ text "Already logged out." ]
                

render : App -> Html App.Msg.Msg
render app =
    case app.account of 
        Just account ->
            div [] 
                [ h2 [] [ text "Account" ]
                , logout app
                ]

        Nothing ->
            div []
                [ h2 [] [ text "Account" ]
                , span [] [ text "Please login to see this page." ]
                ]

signup : App -> Html App.Msg.Msg
signup app =
    div [] 
        [ h2 [] [ text "Signup" ]
        , div []
                [ div [ class "row" ]
                    [ div [ class "input-field col s6" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.AccountSignupName
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                ]
        , button
            [ class "waves-effect waves-light btn"
            , type_ "submit"
            , onClick (App.Msg.AccountSignup)
            , Html.Attributes.name "action"
            --, disabled submitDisabled
            ]
            [ text "Signup"
            , i [ class "material-icons right" ] [ text "send" ]
            ]
        ]
