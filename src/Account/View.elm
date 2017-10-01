module Account.View exposing (render, login, logout, signup)

import App.Msg exposing (Msg(..))
import App.Model exposing (App)
import Account.Model
import Rider.Model
import Html exposing (Html, h2, h4, i, p, label, button, nav, div, text, span, a, input, ul, li)
import Html.Attributes exposing (checked, value, name, class, type_, id, for, class, disabled, href)
import Html.Events exposing (onClick, onInput)


riderNameExists : String -> List Rider.Model.Rider -> Bool
riderNameExists riderName riders =
    List.length
        (List.filter
            (\rider -> (String.toLower rider.name) == (String.toLower riderName))
            riders
        )
        == 1


login : App -> Html App.Msg.Msg
login app =
    case app.page of
        App.Model.AccountLogin accountLogin ->
            let
                submitDisabled =
                    False
            in
                div []
                    [ h2 [] [ text "Login" ]
                    , div []
                        [ div
                            [ class "row" ]
                            [ div [ class "input-field col s6" ]
                                [ input
                                    [ id "email"
                                    , name "email"
                                    , type_ "text"
                                    , value accountLogin.email
                                    , onInput App.Msg.AccountLoginEmail
                                    ]
                                    []
                                , label [ for "email" ] [ text "E-mail" ]
                                ]
                            ]
                        , div
                            [ class "row" ]
                            [ div [ class "input-field col s6" ]
                                [ input
                                    [ id "password"
                                    , name "password"
                                    , type_ "password"
                                    , onInput App.Msg.AccountLoginPassword
                                    ]
                                    []
                                , label [ for "password" ] [ text "Password" ]
                                ]
                            ]
                        ]
                    , button
                        [ class "waves-effect waves-light btn"
                        , type_ "submit"
                        , onClick (App.Msg.AccountLoginSubmit)
                        , Html.Attributes.name "action"
                        , disabled submitDisabled
                        ]
                        [ text "Login"
                        , i [ class "material-icons right" ] [ text "send" ]
                        ]
                    ]

        _ ->
            div [] [ text "accountLogin nothing" ]


logout : App -> Html App.Msg.Msg
logout app =
    case app.account of
        Just account ->
            button
                [ class "waves-effect waves-light btn"
                , type_ "submit"
                , onClick (App.Msg.AccountLogoutSubmit)
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
                , licence app account
                , logout app
                ]

        Nothing ->
            div []
                [ h2 [] [ text "Account" ]
                , span [] [ text "Please login to see this page." ]
                ]


signup : App -> Html App.Msg.Msg
signup app =
    case app.page of
        App.Model.AccountSignup accountSignup ->
            let
                email =
                    String.trim accountSignup.email

                submitDisabled =
                    String.contains "/" email
                        || String.contains "\\" email
                        || String.contains "&" email
                        || email
                        == ""
            in
                div []
                    [ h2 [] [ text "Signup" ]
                    , div []
                        [ div [ class "row" ]
                            [ div [ class "input-field col s6" ]
                                [ input
                                    [ id "email"
                                    , type_ "text"
                                    , value email
                                      --, onInput App.Msg.AccountSignupName
                                    ]
                                    []
                                , label [ for "email" ] [ text "Email" ]
                                ]
                            ]
                        ]
                    , button
                        [ class "waves-effect waves-light btn"
                        , type_ "submit"
                        , onClick (App.Msg.AccountSignup)
                        , Html.Attributes.name "action"
                        , disabled submitDisabled
                        ]
                        [ text "Signup"
                        , i [ class "material-icons right" ] [ text "send" ]
                        ]
                    ]

        _ ->
            div [] [ text "accoutSignup nothing" ]


licence : App -> Account.Model.Account -> Html App.Msg.Msg
licence app account =
    let
        licenceHeading =
            case account.licence of
                Just account ->
                    [ text "Change licence" ]

                Nothing ->
                    [ text "Set licence"
                    , span [ class "new badge" ] [ text "1" ]
                    ]
    in
        div []
            [ h4 [] licenceHeading
            , licenceRadio "elite" "Elite" Rider.Model.Elite account.licence
            , licenceRadio "amateurs" "Amateurs" Rider.Model.Amateurs account.licence
            , licenceRadio "basislidmaatschap" "Basislidmaatschap" Rider.Model.Basislidmaatschap account.licence
            , licenceRadio "other" "Other" Rider.Model.Other account.licence
            ]


licenceRadio : String -> String -> Rider.Model.Licence -> Maybe Rider.Model.Licence -> Html App.Msg.Msg
licenceRadio licenceName licenceText licence maybeCurrentLicence =
    let
        isChecked =
            case maybeCurrentLicence of
                Just currentLicence ->
                    licence == currentLicence

                Nothing ->
                    False
    in
        p []
            [ input [ id licenceName, name "licence", type_ "radio", checked isChecked, onClick (App.Msg.AccountLicence licence) ] []
            , label [ for licenceName ] [ text licenceText ]
            ]
