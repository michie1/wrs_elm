module Account.View exposing (login)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)

import Html exposing (Html, h2, i, label, button, nav, div, text, span, a, input, ul, li)
import Html.Attributes exposing (class, type_, id, for, class, disabled)
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
                        , label [ for "name" ] [ text ("Name " ++ app.accountLogin.name) ]
                        ]
                    ]
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
