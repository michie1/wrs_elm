module Page.Race.Add.View exposing (view)

import Component.SubmitButton
import Component.TextInput
import Data.RaceType exposing (RaceType, raceTypeDescription, raceTypeReadable, raceTypeToString, raceTypes)
import Date
import DatePicker
import Html exposing (Html, button, div, h2, input, p, span)
import Html.Attributes exposing (autofocus, checked, class, disabled, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Page.Race.Add.Model exposing (Model)
import Page.Race.Add.Msg as Msg exposing (Msg)
import Time


label : String -> Html Msg
label text =
    div [ class "field-label" ] [ Html.label [ class "label" ] [ Html.text text ] ]


field : List (Html Msg) -> Html Msg
field body =
    div [ class "field-body" ]
        [ div [ class "control" ] body ]


horizontal : List (Html Msg) -> Html Msg
horizontal body =
    div [ class "field is-horizontal" ] body


settings : DatePicker.Settings
settings =
    DatePicker.defaultSettings


view : Model -> Time.Posix -> Html Msg
view raceAdd now =
    let
        raceName =
            raceAdd.name

        submitDisabled =
            raceName == "" || String.length raceName > 100
    in
    div []
        [ h2 [ class "title is-2" ] [ Html.text "Add Race" ]
        , Component.TextInput.view
            { id = "name"
            , label = "Name"
            , value = raceName
            , onInput = Msg.Name
            , autofocus = True
            , icon = Nothing
            , isHorizontal = True
            }
        , horizontal
            [ label "Category"
            , field [ raceTypeButtons raceAdd.raceType ]
            ]
        , horizontal
            [ label "Date"
            , field [ DatePicker.view (Just (Maybe.withDefault (Date.fromPosix Time.utc now) raceAdd.date)) settings raceAdd.datePicker |> Html.map Msg.ToDatePicker ]
            ]
        , horizontal
            [ label ""
            , field
                [ Component.SubmitButton.view
                    { text = "Add Race"
                    , onClick = Msg.Submit
                    , isDisabled = submitDisabled
                    , name = Nothing
                    }
                ]
            ]
        ]


raceTypeButtonCheck : RaceType -> RaceType -> Html Msg
raceTypeButtonCheck raceType current =
    let
        isChecked =
            raceType == current

        raceTypeName =
            raceTypeToString raceType

        raceTypeText =
            raceTypeReadable raceType
                ++ (case raceTypeDescription raceType of
                        Just description ->
                            " (" ++ description ++ ")"

                        Nothing ->
                            ""
                   )
    in
    Html.label [ for raceTypeName, class "radio" ]
        [ input [ checked isChecked, name "type", type_ "radio", id raceTypeName, onClick (Msg.RaceType raceType) ] []
        , Html.span [] [ Html.text raceTypeText ]
        ]


raceTypeButtons : RaceType -> Html Msg
raceTypeButtons current =
    div [] <|
        List.map (\raceType -> raceTypeButtonCheck raceType current) raceTypes
