module Page.Race.Add.View exposing (render)
import Html exposing (Html, node, p, form, button, div, text, span, input, ul, li, a, i, h2, label)
import Html.Attributes exposing (attribute, autofocus, value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import App.Msg
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import Date
import Ui.Calendar
import Data.RaceType as RaceType exposing (RaceType)
import Data.Race exposing (Race)
import Page.Race.Add.Model exposing (Model)


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date


render : Model -> Html App.Msg.Msg
render raceAdd =
    let
        name =
            raceAdd.name

        submitDisabled =
            name == "" || String.length name > 100

        dateString = dateFormat raceAdd.calendar.value
    in
        div []
            [ h2 [] [ text "Add Race" ]
            , div []
                [ div [ class "row" ]
                    [ div [ class "col s6 input-field" ]
                        [ input
                            [ id "name"
                            , type_ "text"
                            , onInput App.Msg.RaceName
                            , autofocus True
                            , value name
                            ]
                            []
                        , label [ for "name" ] [ text "Name" ]
                        ]
                    ]
                , div [ class "row" ] [ raceTypeButtons raceAdd.raceType ]
                , div [] [ Html.map App.Msg.Calendar (Ui.Calendar.view "en_us" raceAdd.calendar) ]
                , div [ class "row" ]
                    [ div [ class "col s6" ]
                        [ button
                            [ class "waves-effect waves-light btn"
                            , type_ "submit"
                            , onClick App.Msg.RaceAddSubmit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ text "Add Race"
                            , i [ class "material-icons right" ] [ text "send" ]
                            ]
                        ]
                    ]
                ]
            ]


raceTypeButtonCheck : String -> String -> RaceType -> RaceType -> Html App.Msg.Msg
raceTypeButtonCheck raceTypeName raceTypeText raceType current =
    let
        isChecked =
            raceType == current
    in
        p []
            [ input [ checked isChecked, name "type", type_ "radio", id raceTypeName, onClick (App.Msg.RaceAddRaceType raceType) ] []
            , label [ for raceTypeName ] [ text raceTypeText ]
            ]


raceTypeButtons : RaceType -> Html App.Msg.Msg
raceTypeButtons current =
    div [ class "col s6" ]
        [ label [ class "active" ] [ text "Category" ]
        , raceTypeButtonCheck "classic" "Klassieker" RaceType.Classic current
        , raceTypeButtonCheck "criterum" "Criterium" RaceType.Criterium current
        , raceTypeButtonCheck "regiocross" "Regiocross" RaceType.Regiocross current
        , raceTypeButtonCheck "other" "Other" RaceType.Other current
        ]


datepicker : String -> Html App.Msg.Msg
datepicker dateString =
    let
        inputDate =
            Debug.log "dateString" (String.join "/" (String.split "-" dateString))
    in
        div [ class "col s6" ]
            [ label [ class "active" ] [ text "Date" ]
            , node "app-datepicker"
                [ id "datepicker"
                , attribute "first-day-of-week" "1"
                , attribute "input-date" inputDate
                , attribute "disable-days" "[]"
                , attribute "auto-update-date" "true"
                ]
                []
            ]
